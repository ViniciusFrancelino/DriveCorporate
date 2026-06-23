package com.company.drive.service;

import com.company.drive.dto.FolderContentsResponse;
import com.company.drive.dto.FolderRequest;
import com.company.drive.dto.FolderResponse;
import com.company.drive.dto.FileResponse;
import com.company.drive.entity.FileEntity;
import com.company.drive.entity.Folder;
import com.company.drive.entity.User;
import com.company.drive.exception.AccessDeniedException;
import com.company.drive.exception.BadRequestException;
import com.company.drive.exception.ResourceNotFoundException;
import com.company.drive.repository.FileRepository;
import com.company.drive.repository.FolderRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FolderService {
    private final FolderRepository folders;
    private final FileRepository files;
    private final CurrentUserService current;

    public FolderService(FolderRepository folders, FileRepository files, CurrentUserService current) {
        this.folders = folders;
        this.files = files;
        this.current = current;
    }

    @Transactional
    public FolderResponse create(FolderRequest request) {
        User user = current.get();
        Folder parent = request.getParentFolderId() == null ? null : getOwned(request.getParentFolderId(), user);
        String name = request.getName().trim();
        boolean duplicate = parent == null
            ? folders.existsByUserAndNameAndParentFolderIsNull(user, name)
            : folders.existsByUserAndNameAndParentFolder(user, name, parent);
        if (duplicate) throw new BadRequestException("Já existe uma pasta com esse nome neste nível");

        Folder folder = new Folder();
        folder.setName(name);
        folder.setParentFolder(parent);
        folder.setUser(user);
        return FolderResponse.from(folders.save(folder));
    }

    @Transactional(readOnly = true)
    public List<FolderResponse> list() {
        return folders.findByUserOrderByCreatedAtDesc(current.get()).stream().map(FolderResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public FolderResponse getById(Long id) {
        return FolderResponse.from(getOwned(id, current.get()));
    }

    @Transactional(readOnly = true)
    public FolderContentsResponse contents(Long id) {
        User user = current.get();
        Folder folder = getOwned(id, user);
        List<FolderResponse> subFolders = folders.findByUserAndParentFolderOrderByCreatedAtDesc(user, folder)
            .stream().map(FolderResponse::from).toList();
        List<FileResponse> folderFiles = files.findByUserAndFolderAndDeletedFalseOrderByCreatedAtDesc(user, folder)
            .stream().map(FileResponse::from).toList();
        return new FolderContentsResponse(FolderResponse.from(folder), subFolders, folderFiles);
    }

    /** Removes a folder tree and moves every contained active file to the logical trash. */
    @Transactional
    public void delete(Long id) {
        User user = current.get();
        List<Folder> hierarchy = new ArrayList<>();
        collectFolders(user, getOwned(id, user), hierarchy);

        for (FileEntity file : files.findByUserAndFolderIn(user, hierarchy)) {
            if (!file.isDeleted()) file.setDeleted(true);
            file.setFolder(null);
        }
        files.flush();

        for (int index = hierarchy.size() - 1; index >= 0; index--) {
            folders.delete(hierarchy.get(index));
            folders.flush();
        }
    }

    private void collectFolders(User user, Folder folder, List<Folder> result) {
        result.add(folder);
        for (Folder child : folders.findByUserAndParentFolderOrderByCreatedAtDesc(user, folder)) {
            collectFolders(user, child, result);
        }
    }

    public Folder getOwned(Long id, User user) {
        Folder folder = folders.findById(id).orElseThrow(() -> new ResourceNotFoundException("Pasta não encontrada"));
        if (!folder.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Você não pode acessar esta pasta");
        }
        return folder;
    }
}

package com.company.drive.service;

import com.company.drive.dto.FileResponse;
import com.company.drive.entity.FileEntity;
import com.company.drive.entity.Folder;
import com.company.drive.entity.User;
import com.company.drive.exception.AccessDeniedException;
import com.company.drive.exception.ResourceNotFoundException;
import com.company.drive.repository.FileRepository;
import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileService {
    private final FileRepository files;
    private final CurrentUserService current;
    private final FolderService folders;
    private final StorageService storage;

    public FileService(FileRepository files, CurrentUserService current, FolderService folders, StorageService storage) {
        this.files = files;
        this.current = current;
        this.folders = folders;
        this.storage = storage;
    }

    @Transactional
    public FileResponse upload(MultipartFile upload, Long folderId) {
        User user = current.get();
        Folder folder = folderId == null ? null : folders.getOwned(folderId, user);
        StorageService.StoredFile saved = storage.store(upload, user.getId());
        FileEntity file = new FileEntity();
        file.setOriginalName(saved.originalName());
        file.setStoredName(saved.storedName());
        file.setExtension(saved.extension());
        file.setContentType(upload.getContentType());
        file.setSize(upload.getSize());
        file.setStoragePath(saved.path());
        file.setFolder(folder);
        file.setUser(user);
        return FileResponse.from(files.save(file));
    }

    @Transactional(readOnly = true)
    public List<FileResponse> list() {
        return files.findByUserAndDeletedFalseOrderByCreatedAtDesc(current.get()).stream().map(FileResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<FileResponse> search(String name) {
        if (name == null || name.isBlank()) return list();
        return files.findByUserAndDeletedFalseAndOriginalNameContainingIgnoreCaseOrderByCreatedAtDesc(current.get(), name.trim())
            .stream().map(FileResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<FileResponse> trash() {
        return files.findByUserAndDeletedTrueOrderByUpdatedAtDesc(current.get()).stream().map(FileResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public FileResponse getById(Long id) { return FileResponse.from(ownedActive(id, current.get())); }

    public Download download(Long id) {
        FileEntity file = ownedActive(id, current.get());
        return new Download(storage.load(file.getStoragePath()), file.getOriginalName(), file.getContentType());
    }

    @Transactional
    public void delete(Long id) {
        FileEntity file = ownedActive(id, current.get());
        file.setDeleted(true);
        files.save(file);
    }

    private FileEntity ownedActive(Long id, User user) {
        FileEntity file = files.findById(id).orElseThrow(() -> new ResourceNotFoundException("Arquivo não encontrado"));
        if (file.isDeleted()) throw new ResourceNotFoundException("Arquivo não encontrado");
        if (!file.getUser().getId().equals(user.getId())) throw new AccessDeniedException("Você não pode acessar este arquivo");
        return file;
    }

    public record Download(Resource resource, String originalName, String contentType) { }
}

package com.company.drive.service;

import com.company.drive.dto.FavoritesResponse;
import com.company.drive.dto.FileResponse;
import com.company.drive.dto.FolderResponse;
import com.company.drive.entity.User;
import com.company.drive.repository.FileRepository;
import com.company.drive.repository.FolderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FavoriteService {
    private final CurrentUserService current;
    private final FileRepository files;
    private final FolderRepository folders;

    public FavoriteService(CurrentUserService current, FileRepository files, FolderRepository folders) {
        this.current = current;
        this.files = files;
        this.folders = folders;
    }

    @Transactional(readOnly = true)
    public FavoritesResponse list() {
        User user = current.get();
        return new FavoritesResponse(
            folders.findByUserAndFavoriteTrueOrderByUpdatedAtDesc(user).stream().map(FolderResponse::from).toList(),
            files.findByUserAndFavoriteTrueAndDeletedFalseOrderByUpdatedAtDesc(user).stream().map(FileResponse::from).toList()
        );
    }
}

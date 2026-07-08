package com.company.drive.service;

import com.company.drive.dto.*;
import com.company.drive.entity.User;
import com.company.drive.exception.BadRequestException;
import com.company.drive.repository.FileRepository;
import com.company.drive.repository.FolderRepository;
import com.company.drive.repository.UserRepository;
import java.util.Locale;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    private final CurrentUserService currentUser;
    private final UserRepository users;
    private final FileRepository files;
    private final FolderRepository folders;
    private final PasswordEncoder encoder;

    public UserService(CurrentUserService currentUser, UserRepository users, FileRepository files, FolderRepository folders, PasswordEncoder encoder) {
        this.currentUser = currentUser;
        this.users = users;
        this.files = files;
        this.folders = folders;
        this.encoder = encoder;
    }

    public CurrentUserResponse me() {
        return CurrentUserResponse.from(currentUser.get());
    }

    @Transactional
    public CurrentUserResponse updateProfile(UpdateProfileRequest request) {
        User user = currentUser.get();
        user.setName(request.name().trim());
        return CurrentUserResponse.from(users.save(user));
    }

    @Transactional
    public CurrentUserResponse updateEmail(UpdateEmailRequest request) {
        User user = currentUser.get();
        String email = request.email().trim().toLowerCase();
        if (!encoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BadRequestException("Senha atual incorreta.");
        }
        if (users.existsByEmailAndIdNot(email, user.getId())) {
            throw new BadRequestException("Este e-mail já está em uso.");
        }
        user.setEmail(email);
        return CurrentUserResponse.from(users.save(user));
    }

    @Transactional
    public MessageResponse changePassword(ChangePasswordRequest request) {
        User user = currentUser.get();
        if (!encoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BadRequestException("Senha atual incorreta.");
        }
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new BadRequestException("A confirmação da senha não confere.");
        }
        user.setPassword(encoder.encode(request.newPassword()));
        users.save(user);
        return new MessageResponse("Senha alterada com sucesso.");
    }

    @Transactional
    public MessageResponse deleteCurrentAccount(DeleteAccountRequest request) {
        User user = currentUser.get();
        if (!encoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BadRequestException("Senha atual incorreta.");
        }
        user.setActive(false);
        users.save(user);
        return new MessageResponse("Conta deletada com sucesso.");
    }

    public UserKpiResponse kpis() {
        User user = currentUser.get();
        long totalFiles = files.countByUserAndDeletedFalse(user);
        long totalFolders = folders.countByUser(user);
        long storageUsed = files.sumStorageUsedByUser(user);
        return new UserKpiResponse(totalFiles, totalFolders, storageUsed, formatBytes(storageUsed));
    }

    private String formatBytes(long bytes) {
        if (bytes < 1024) return bytes + " B";
        double kb = bytes / 1024.0;
        if (kb < 1024) return formatNumber(kb) + " KB";
        double mb = kb / 1024.0;
        if (mb < 1024) return formatNumber(mb) + " MB";
        return formatNumber(mb / 1024.0) + " GB";
    }

    private String formatNumber(double value) {
        if (value == Math.floor(value)) return String.format(Locale.US, "%.0f", value);
        return String.format(Locale.US, "%.1f", value);
    }
}

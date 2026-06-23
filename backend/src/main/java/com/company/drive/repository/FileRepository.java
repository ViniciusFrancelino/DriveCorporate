package com.company.drive.repository;
import com.company.drive.entity.FileEntity;
import com.company.drive.entity.Folder;
import com.company.drive.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface FileRepository extends JpaRepository<FileEntity, Long> {
    List<FileEntity> findByUserAndDeletedFalseOrderByCreatedAtDesc(User user);
    List<FileEntity> findByUserAndDeletedTrueOrderByUpdatedAtDesc(User user);
    List<FileEntity> findByUserAndFolderAndDeletedFalseOrderByCreatedAtDesc(User user, Folder folder);
    List<FileEntity> findByUserAndFolderIn(User user, Collection<Folder> folders);
    List<FileEntity> findByUserAndDeletedFalseAndOriginalNameContainingIgnoreCaseOrderByCreatedAtDesc(User user, String name);
}

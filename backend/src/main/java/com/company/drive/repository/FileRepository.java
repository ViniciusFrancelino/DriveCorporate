package com.company.drive.repository;
import com.company.drive.entity.FileEntity;
import com.company.drive.entity.Folder;
import com.company.drive.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.*;
public interface FileRepository extends JpaRepository<FileEntity, Long> {
    List<FileEntity> findByUserAndDeletedFalseOrderByCreatedAtDesc(User user);
    List<FileEntity> findByUserAndDeletedTrueOrderByUpdatedAtDesc(User user);
    List<FileEntity> findByUserAndFolderAndDeletedFalseOrderByCreatedAtDesc(User user, Folder folder);
    List<FileEntity> findByUserAndFolderIn(User user, Collection<Folder> folders);
    List<FileEntity> findByUserAndDeletedFalseAndOriginalNameContainingIgnoreCaseOrderByCreatedAtDesc(User user, String name);
    List<FileEntity> findByUserAndFavoriteTrueAndDeletedFalseOrderByUpdatedAtDesc(User user);
    long countByUserAndDeletedFalse(User user);
    @Query("select coalesce(sum(f.size), 0) from FileEntity f where f.user = :user and f.deleted = false")
    Long sumStorageUsedByUser(@Param("user") User user);
}

package com.company.drive.repository;
import com.company.drive.entity.Folder;
import com.company.drive.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> findByUserOrderByCreatedAtDesc(User user);
    List<Folder> findByUserAndParentFolderOrderByCreatedAtDesc(User user, Folder parentFolder);
    List<Folder> findByUserAndFavoriteTrueOrderByUpdatedAtDesc(User user);
    boolean existsByUserAndNameAndParentFolder(User user, String name, Folder parentFolder);
    boolean existsByUserAndNameAndParentFolderIsNull(User user, String name);
    long countByUser(User user);
}

package com.company.drive.service;
import com.company.drive.config.StorageProperties;
import com.company.drive.exception.BadRequestException;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;
@Service public class StorageService {
 private static final Set<String> EXTENSIONS=Set.of("pdf","docx","xlsx","png","jpg","jpeg","txt","zip");
 private final Path root;
 public StorageService(StorageProperties p){this.root=Paths.get(p.getPath()).toAbsolutePath().normalize();}
 @PostConstruct void initialize(){try{Files.createDirectories(root);}catch(IOException e){throw new IllegalStateException("Não foi possível criar o diretório de armazenamento",e);}}
 public StoredFile store(MultipartFile file,Long userId){String original=safeOriginalName(file.getOriginalFilename());String extension=extension(original);validate(file,extension);String storedName=UUID.randomUUID()+"."+extension;Path userDir=root.resolve(String.valueOf(userId)).normalize();Path destination=userDir.resolve(storedName).normalize();if(!userDir.startsWith(root)||!destination.startsWith(userDir))throw new BadRequestException("Caminho de arquivo inválido");try{Files.createDirectories(userDir);Files.copy(file.getInputStream(),destination,StandardCopyOption.REPLACE_EXISTING);return new StoredFile(original,storedName,extension,destination.toString());}catch(IOException e){throw new BadRequestException("Não foi possível salvar o arquivo");}}
 public Resource load(String storagePath){try{Path path=Paths.get(storagePath).toAbsolutePath().normalize();if(!path.startsWith(root)||!Files.exists(path))throw new BadRequestException("Arquivo físico não encontrado");return new UrlResource(path.toUri());}catch(IOException e){throw new BadRequestException("Arquivo físico não encontrado");}}
 private void validate(MultipartFile file,String ext){if(file.isEmpty())throw new BadRequestException("O arquivo não pode estar vazio");if(file.getSize()>50L*1024*1024)throw new BadRequestException("O arquivo deve ter no máximo 50MB");if(!EXTENSIONS.contains(ext))throw new BadRequestException("Tipo de arquivo não permitido");String type=file.getContentType();if(type==null||type.isBlank()||!validContentType(ext,type.toLowerCase()))throw new BadRequestException("Content type inválido para o arquivo enviado");}
 private boolean validContentType(String ext,String type){return switch(ext){case "pdf"->type.equals("application/pdf");case "docx"->type.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document");case "xlsx"->type.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");case "png"->type.equals("image/png");case "jpg","jpeg"->type.equals("image/jpeg");case "txt"->type.startsWith("text/plain");case "zip"->type.equals("application/zip")||type.equals("application/x-zip-compressed")||type.equals("multipart/x-zip");default->false;};}
 private String safeOriginalName(String value){if(value==null||value.isBlank())throw new BadRequestException("Nome de arquivo inválido");if(value.contains("..")||value.contains("/")||value.contains("\\"))throw new BadRequestException("Nome de arquivo inválido");String name=Paths.get(value).getFileName().toString();if(!name.equals(value))throw new BadRequestException("Nome de arquivo inválido");return name;}
 private String extension(String name){int dot=name.lastIndexOf('.');if(dot<=0||dot==name.length()-1)throw new BadRequestException("O arquivo precisa ter uma extensão válida");return name.substring(dot+1).toLowerCase(Locale.ROOT);}
 public record StoredFile(String originalName,String storedName,String extension,String path){}
}

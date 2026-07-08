package com.company.drive.controller;

import com.company.drive.dto.FileResponse;
import com.company.drive.service.FileService;
import java.util.List;
import java.util.Map;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:5173")
public class FileController {
    private final FileService service;
    public FileController(FileService service) { this.service = service; }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public FileResponse upload(@RequestParam("file") MultipartFile file, @RequestParam(required = false) Long folderId) {
        return service.upload(file, folderId);
    }

    @GetMapping
    public List<FileResponse> list() { return service.list(); }

    @GetMapping("/search")
    public List<FileResponse> search(@RequestParam String name) { return service.search(name); }

    @GetMapping("/trash")
    public List<FileResponse> trash() { return service.trash(); }

    @GetMapping("/{id}")
    public FileResponse get(@PathVariable Long id) { return service.getById(id); }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable Long id) {
        FileService.Download file = service.download(id);
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(file.contentType()))
            .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(file.originalName()).build().toString())
            .body(file.resource());
    }

    @DeleteMapping("/{id}")
    public Map<String, String> delete(@PathVariable Long id) {
        service.delete(id);
        return Map.of("message", "Arquivo excluído com sucesso.");
    }

    @PatchMapping("/{id}/favorite")
    public FileResponse favorite(@PathVariable Long id) { return service.favorite(id); }

    @PatchMapping("/{id}/unfavorite")
    public FileResponse unfavorite(@PathVariable Long id) { return service.unfavorite(id); }
}

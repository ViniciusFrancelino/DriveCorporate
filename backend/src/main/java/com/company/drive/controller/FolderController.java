package com.company.drive.controller;

import com.company.drive.dto.FolderContentsResponse;
import com.company.drive.dto.FolderRequest;
import com.company.drive.dto.FolderResponse;
import com.company.drive.service.FolderService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/folders")
@CrossOrigin(origins = "http://localhost:5173")
public class FolderController {
    private final FolderService service;
    public FolderController(FolderService service) { this.service = service; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FolderResponse create(@Valid @RequestBody FolderRequest request) { return service.create(request); }

    @GetMapping
    public List<FolderResponse> list() { return service.list(); }

    @GetMapping("/{id}/contents")
    public FolderContentsResponse contents(@PathVariable Long id) { return service.contents(id); }

    @GetMapping("/{id}")
    public FolderResponse get(@PathVariable Long id) { return service.getById(id); }

    @DeleteMapping("/{id}")
    public Map<String, String> delete(@PathVariable Long id) {
        service.delete(id);
        return Map.of("message", "Pasta excluída e arquivos enviados para a lixeira.");
    }
}

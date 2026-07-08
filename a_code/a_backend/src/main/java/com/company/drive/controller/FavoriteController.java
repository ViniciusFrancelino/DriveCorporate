package com.company.drive.controller;

import com.company.drive.dto.FavoritesResponse;
import com.company.drive.service.FavoriteService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:5173")
public class FavoriteController {
    private final FavoriteService service;

    public FavoriteController(FavoriteService service) {
        this.service = service;
    }

    @GetMapping
    public FavoritesResponse list() {
        return service.list();
    }
}

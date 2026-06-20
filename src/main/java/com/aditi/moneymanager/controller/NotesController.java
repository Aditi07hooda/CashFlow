package com.aditi.moneymanager.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aditi.moneymanager.model.NotesModel;
import com.aditi.moneymanager.service.NotesService;

@RestController
public class NotesController {

    @Autowired
    private NotesService service;

    @GetMapping("/notes")
    public ResponseEntity<List<NotesModel>> getNotes(Authentication req) {
        List<NotesModel> notes = service.getNotes(req.getName());
        return ResponseEntity.ok(notes);
    }

    @PostMapping("/notes")
    public ResponseEntity<NotesModel> addNote(Authentication req, @RequestBody Map<String, String> payload) {
        NotesModel noteModel = service.addNote(req.getName(), payload);
        return ResponseEntity.ok(noteModel);
    }

    @PutMapping("/notes/{id}")
    public ResponseEntity<NotesModel> updateNote(Authentication req, 
            @PathVariable Long id, @RequestBody Map<String, String> payload) {
        NotesModel updatedNote = service.updateNote(req.getName(), id, payload.get("note"));
        return ResponseEntity.ok(updatedNote);
    }

    @DeleteMapping("/notes/{id}")
    public ResponseEntity<String> deleteNote(Authentication req, @PathVariable Long id) {
        service.deleteNote(req.getName(), id);
        return ResponseEntity.ok("Note deleted successfully.");
    }
}

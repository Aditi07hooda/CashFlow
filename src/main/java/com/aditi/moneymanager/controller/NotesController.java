package com.aditi.moneymanager.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<NotesModel>> getNotes(@RequestParam String username) {
        List<NotesModel> notes = service.getNotes(username);
        return ResponseEntity.ok(notes);
    }

    @PostMapping("/notes")
    public ResponseEntity<NotesModel> addNote(@RequestParam String username, @RequestBody Map<String, String> payload) {
        NotesModel noteModel = service.addNote(username, payload);
        return ResponseEntity.ok(noteModel);
    }

    @PutMapping("/notes/{id}")
    public ResponseEntity<NotesModel> updateNote(@RequestParam String username, 
            @PathVariable Long id, @RequestBody Map<String, String> payload) {
        NotesModel updatedNote = service.updateNote(username, id, payload.get("note"));
        return ResponseEntity.ok(updatedNote);
    }

    @DeleteMapping("/notes/{id}")
    public ResponseEntity<String> deleteNote(@RequestParam String username, @PathVariable Long id) {
        service.deleteNote(username, id);
        return ResponseEntity.ok("Note deleted successfully.");
    }
}

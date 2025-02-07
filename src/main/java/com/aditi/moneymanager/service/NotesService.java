package com.aditi.moneymanager.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aditi.moneymanager.model.NotesModel;
import com.aditi.moneymanager.model.UserModel;
import com.aditi.moneymanager.repo.NotesRepo;
import com.aditi.moneymanager.repo.UserRepo;

@Service
public class NotesService {
    @Autowired
    private NotesRepo repo;

    @Autowired
    private UserRepo userRepo;

    public List<NotesModel> getNotes(String username) {
        UserModel user = userRepo.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }
        return repo.findByUser(user);
    }

    public NotesModel addNote(String username, Map<String, String> payload) {
        UserModel user = userRepo.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }
        NotesModel note = new NotesModel();
        note.setUser(user);
        note.setNote(payload.get("note"));
        note.setCreatedAt(new java.sql.Date(System.currentTimeMillis()));
        note.setUpdatedAt(new java.sql.Date(System.currentTimeMillis()));
        return repo.save(note);
    }

    public NotesModel updateNote(String username, Long noteId, String newContent) {
        UserModel user = userRepo.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }
        NotesModel note = repo.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found with ID: " + noteId));
        note.setNote(newContent);
        note.setUpdatedAt(new java.sql.Date(System.currentTimeMillis()));
        return repo.save(note);
    }

    public void deleteNote(String username, Long noteId) {
        UserModel user = userRepo.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }
        NotesModel note = repo.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found with ID: " + noteId));
        repo.delete(note);
    }
}

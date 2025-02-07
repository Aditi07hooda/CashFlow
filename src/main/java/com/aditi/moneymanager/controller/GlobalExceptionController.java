package com.aditi.moneymanager.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.aditi.moneymanager.Errors.UniqueEmailException;
import com.aditi.moneymanager.Errors.UserNotFound;

@ControllerAdvice
public class GlobalExceptionController {

    @ExceptionHandler(UniqueEmailException.class)
    public ResponseEntity<String> handleUniqueEmailException(UniqueEmailException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UserNotFound.class)
    public ResponseEntity<String> handleUserNotFound(UserNotFound e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    }
}

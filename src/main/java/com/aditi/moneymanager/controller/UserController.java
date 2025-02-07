package com.aditi.moneymanager.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import com.aditi.moneymanager.model.LoginModel;
import com.aditi.moneymanager.model.UserModel;
import com.aditi.moneymanager.security.JWTSecurity;
import com.aditi.moneymanager.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class UserController {

    @Autowired
    private UserService service;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    private JWTSecurity jwtSecurity;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<UserModel> register(@RequestBody UserModel user, HttpServletResponse response) {
        String password = user.getPassword();
        UserModel userReg = service.registerUser(user);
        try {
            // System.out.println("Authenticating with username: " + user.getUsername());
            // System.out.println("Authenticating with password: " + password);

            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), password));

            if (auth.isAuthenticated()) {
                System.out.println("user : " + userReg.getUsername());
                String token = jwtSecurity.getJwtToken(userReg.getUsername());
                Cookie cookie = new Cookie("jwt_token", token);
                cookie.setMaxAge(Integer.parseInt(System.getProperty("JWT_EXPIRY")));
                cookie.setHttpOnly(true);
                cookie.setSecure(true);
                cookie.setPath("/");
                response.addCookie(cookie);
            }
        } catch (Exception e) {
            System.err.println("Authentication failed: " + e.getMessage());
        }
        return ResponseEntity.ok(userReg);
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<UserModel> login(@RequestBody LoginModel user, HttpServletResponse response) {
        String password = user.getPassword();
        UserModel userReg = service.login(user);
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userReg.getUsername(), password));

            if (auth.isAuthenticated()) {
                System.out.println("user : " + userReg.getUsername());
                String token = jwtSecurity.getJwtToken(userReg.getUsername());
                Cookie cookie = new Cookie("jwt_token", token);
                cookie.setMaxAge(Integer.parseInt(System.getProperty("JWT_EXPIRY")));
                cookie.setHttpOnly(true);
                cookie.setSecure(true);
                cookie.setPath("/");
                response.addCookie(cookie);
            }
        } catch (Exception e) {
            System.err.println("Authentication failed: " + e.getMessage());
        }
        return ResponseEntity.ok(userReg);
    }

    @GetMapping("/myaccount")
    public ResponseEntity<Map<String, Object>> myAccount(@RequestParam String username, @RequestParam String minDateControl, @RequestParam String maxDateControl) {
        Map<String, Object> map = service.getUser(username, minDateControl, maxDateControl);
        return ResponseEntity.ok(map);
    }
}

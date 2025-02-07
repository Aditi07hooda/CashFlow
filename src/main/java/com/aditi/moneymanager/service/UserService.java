package com.aditi.moneymanager.service;

import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.aditi.moneymanager.Errors.UniqueEmailException;
import com.aditi.moneymanager.Errors.UserNotFound;
import com.aditi.moneymanager.model.LoginModel;
import com.aditi.moneymanager.model.TransactionModel;
import com.aditi.moneymanager.model.UserModel;
import com.aditi.moneymanager.repo.UserRepo;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepo repo;

    @Autowired
    private TransactionService transactionService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserModel user = repo.findByUsername(username);
        // System.out.println(username);
        if (user == null) {
            System.out.println("User not found");
            throw new UsernameNotFoundException("User not found");
        }
        return new UserPrincipal(user);
    }

    public UserDetails loadUserByEmail(String email) {
        UserModel user = repo.findByEmail(email);
        if (user == null) {
            System.out.println("User not found");
        }
        return new UserPrincipal(user);
    }

    public Map<String, Object> getUser(String username, String dateMinControl, String dateMaxControl) {
        Map<String, Object> map = new HashMap<>();

        UserModel user = repo.findByUsername(username);
        Double totalIncome = transactionService.getTotalIncome(username, dateMinControl, dateMaxControl);
        Double totalExpense = transactionService.getTotalSpending(username, dateMinControl, dateMaxControl);
        List<TransactionModel> transactions = transactionService.getAllTransactions(username);

        map.put("user", user);
        map.put("totalIncome", totalIncome);
        map.put("totalExpense", totalExpense);
        map.put("transactions", transactions);
        
        return map;
    }

    public UserModel registerUser(UserModel user) {
        try {
            System.out.println("Registering user: " + user);

            user.setPassword(encoder.encode(user.getPassword()));
            user.setCreatedAt(new Date(System.currentTimeMillis()));
            user.setUpdatedAt(new Date(System.currentTimeMillis()));
            return repo.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new UniqueEmailException("Email already in use. Please register with a new email address");
        } catch (Exception e) {
            System.err.println("Error occurred during user registration: " + e.getMessage());
            throw e;
        }
    }

    public UserModel login(LoginModel user) {
        try {
            UserDetails existingUser = loadUserByEmail(user.getEmail());
            if (encoder.matches(user.getPassword(), existingUser.getPassword())) {
                UserModel userFound = repo.findByEmail(user.getEmail());
                return userFound;
            }
            return null;
        } catch (UserNotFound e) {
            throw new UserNotFound("user not found. Please login");
        } catch (Exception e) {
            System.err.println("Error occurred during user login: " + e.getMessage());
            throw e;
        }
    }
}

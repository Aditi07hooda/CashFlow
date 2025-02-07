package com.aditi.moneymanager.Errors;

public class UserNotFound extends RuntimeException {
    public UserNotFound(String msg){
        super(msg);
    }
}

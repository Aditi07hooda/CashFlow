package com.aditi.moneymanager.Errors;

public class UniqueEmailException extends RuntimeException {
    public UniqueEmailException(String msg){
        super(msg);
    }
}

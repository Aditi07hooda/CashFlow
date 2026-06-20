package com.aditi.moneymanager.security;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.List;

@Component
public class CorsConfigurationSetup {

    @Bean
    public CorsConfigurationSource corsConfigurationSource()
    {
        CorsConfiguration cors = new CorsConfiguration();

        ArrayList<String> origins = new ArrayList<>();
        origins.add("http://localhost:3000");

        cors.setAllowedOrigins(origins);
        cors.setAllowedMethods(List.of("POST", "GET", "PUT", "DELETE"));
        cors.setAllowedHeaders(List.of("*"));
        cors.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource corsSrc = new UrlBasedCorsConfigurationSource();
        corsSrc.registerCorsConfiguration("/**", cors);
        return corsSrc;
    }
}

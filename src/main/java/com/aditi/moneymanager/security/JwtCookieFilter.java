package com.aditi.moneymanager.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.*;

@Component
public class JwtCookieFilter extends OncePerRequestFilter {

    @Override
    protected  void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws ServletException, IOException {
        String token = null;

        // get jwt token from the cookie
        if(req.getCookies() != null){
            for(Cookie c : req.getCookies()){
                if("jwt_token".equals(c.getName())){
                    token = c.getValue();
                    break;
                }
            }
        }

        // set authorization bearer token
        if(token != null && !(req.getRequestURI().equals("/register") || req.getRequestURI().equals("/login"))){
            String finalToken = token;
            HttpServletRequest wrappedReq = new HttpServletRequestWrapper(req) {
                @Override
                public String getHeader(String name) {
                    if("Authorization".equalsIgnoreCase(name)){
                        return "Bearer " + finalToken;
                    }
                    return super.getHeader(name);
                }
            };

            chain.doFilter(wrappedReq, res);
        }
        else {
            chain.doFilter(req, res);
        }
    }
}

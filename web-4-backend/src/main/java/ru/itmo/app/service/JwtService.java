package ru.itmo.app.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import jakarta.ejb.Stateless;

@Stateless
public class JwtService {
    private final Algorithm algorithm = Algorithm.HMAC256("SECRET");
    public String createToken(String username) {
        return JWT.create().withSubject(username).sign(algorithm);
    }

    public String getUsernameFromToken(String token) {
        return JWT.decode(token).getSubject();
    }
}

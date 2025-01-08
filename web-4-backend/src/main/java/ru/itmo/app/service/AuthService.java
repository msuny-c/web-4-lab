package ru.itmo.app.service;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import ru.itmo.app.dto.UserDTO;
import ru.itmo.app.model.UserModel;
import ru.itmo.app.repository.UserRepository;
import ru.itmo.app.util.PasswordUtil;

@Stateless
public class AuthService {
    @EJB
    private UserRepository userRepository;

    private JwtService jwtService = new JwtService();

    public String signUp(UserDTO user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new WebApplicationException(
                Response.status(Response.Status.BAD_REQUEST)
                       .entity("{\"error\": \"User already exists\"}")
                       .type(MediaType.APPLICATION_JSON)
                       .build()
            );
        }
        String salt = PasswordUtil.generateSalt();
        String hashedPassword = PasswordUtil.hashPassword(user.getPassword(), salt);
        
        UserModel userModel = UserModel.builder()
            .username(user.getUsername())
            .password(hashedPassword)
            .salt(salt)
            .build();
            
        userRepository.save(userModel);
        String token = jwtService.createToken(user.getUsername());
        return token;
    }

    public String signIn(UserDTO user) {
        UserModel userModel = userRepository.findByUsername(user.getUsername());
        if (userModel == null) {
            throw new WebApplicationException(
                Response.status(Response.Status.NOT_FOUND)
                       .entity("{\"error\": \"User not found\"}")
                       .type(MediaType.APPLICATION_JSON)
                       .build()
            );
        }

        if (!PasswordUtil.verifyPassword(user.getPassword(), userModel.getSalt(), userModel.getPassword())) {
            throw new WebApplicationException(
                Response.status(Response.Status.UNAUTHORIZED)
                       .entity("{\"error\": \"Invalid password\"}")
                       .type(MediaType.APPLICATION_JSON)
                       .build()
            );
        }

        String token = jwtService.createToken(user.getUsername());
        return token;
    }
}

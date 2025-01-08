package ru.itmo.app.controller;

import jakarta.ws.rs.Produces;
import jakarta.ejb.EJB;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import ru.itmo.app.dto.UserDTO;
import ru.itmo.app.dto.TokenResponseDTO;
import ru.itmo.app.service.AuthService;

@Path("/auth")
public class AuthController {
    @EJB
    private AuthService authService;

    @Path("/signup")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response signUp(@Valid UserDTO user) {
        var token = authService.signUp(user);
        return Response.ok(new TokenResponseDTO(token)).build();
    }
    @Path("/signin")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response signIn(@Valid UserDTO user) {
        var token = authService.signIn(user);
        return Response.ok(new TokenResponseDTO(token)).build();
    }
}

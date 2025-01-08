package ru.itmo.app.filter;

import java.io.IOException;
import java.util.Set;
import java.security.Principal;

import jakarta.annotation.Priority;
import jakarta.ejb.EJB;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;
import ru.itmo.app.service.JwtService;
import ru.itmo.app.repository.UserRepository;
import jakarta.ws.rs.Priorities;

@Provider
@Priority(Priorities.AUTHORIZATION)
public class AuthorizationFilter implements ContainerRequestFilter {
    private final static Set<String> ALLOWED_PATHS = Set.of("/auth/signup", "/auth/signin");
    @EJB
    private JwtService jwtService;
    @EJB
    private UserRepository userRepository;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        var path = requestContext.getUriInfo().getPath();
        if (ALLOWED_PATHS.contains(path)) {
            return;
        }

        var authorizationHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);
        if (authorizationHeader == null) {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
            return;
        }

        if (!authorizationHeader.startsWith("Bearer ")) {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
            return;
        }

        var token = authorizationHeader.split(" ")[1];
        var username = jwtService.getUsernameFromToken(token);
        if (username == null) {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
            return;
        }

        // Check if user exists in database
        if (!userRepository.existsByUsername(username)) {
            requestContext.abortWith(
                Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\": \"User not found\"}")
                    .type(MediaType.APPLICATION_JSON)
                    .build()
            );
            return;
        }

        SecurityContext currentSecurityContext = requestContext.getSecurityContext();
        requestContext.setSecurityContext(new SecurityContext() {
            @Override
            public Principal getUserPrincipal() {
                return () -> username;
            }

            @Override
            public boolean isUserInRole(String role) {
                return true;
            }

            @Override
            public boolean isSecure() {
                return currentSecurityContext.isSecure();
            }

            @Override
            public String getAuthenticationScheme() {
                return "Bearer";
            }
        });
    }
}

package ru.itmo.app.controller;

import jakarta.ejb.EJB;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import ru.itmo.app.service.PointsService;
import jakarta.validation.Valid;
import ru.itmo.app.dto.PointDTO;
@Path("/points")
public class PointsController {

    @EJB
    private PointsService pointsService;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPoints(@Context SecurityContext securityContext) {
        String username = securityContext.getUserPrincipal().getName();
        var points = pointsService.getPoints(username);
        return Response.ok(points).build();
    }

    @POST
    @Path("/check")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response savePoint(@Valid PointDTO pointDTO, @Context SecurityContext securityContext) {
        String username = securityContext.getUserPrincipal().getName();
        try {
            pointDTO = pointsService.savePoint(username, pointDTO);
        } catch (WebApplicationException e) {
            return Response.status(e.getResponse().getStatus()).build();
        }
        return Response.ok(pointDTO).build();
    }
}

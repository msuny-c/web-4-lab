package ru.itmo.app.service;

import java.util.Date;
import java.util.List;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import ru.itmo.app.dto.PointDTO;
import ru.itmo.app.model.PointModel;
import ru.itmo.app.repository.PointsRepository;
import ru.itmo.app.repository.UserRepository;
import ru.itmo.app.util.AreaChecker;

@Stateless
public class PointsService {
    @EJB
    private PointsRepository pointsRepository;
    @EJB
    private UserRepository userRepository;
    public PointDTO savePoint(String username, PointDTO pointDTO) {
        var user = userRepository.findByUsername(username);
        boolean inArea = AreaChecker.inArea(pointDTO.getX(), pointDTO.getY(), pointDTO.getR());
        var pointModel = PointModel.builder()
            .user(user)
            .x(pointDTO.getX())
            .y(pointDTO.getY())
            .r(pointDTO.getR())
            .result(inArea)
            .timestamp(new Date())
            .build();
        pointsRepository.save(pointModel);
        pointDTO.setResult(inArea);
        pointDTO.setTimestamp(pointModel.getTimestamp());
        return pointDTO;
    }

    public List<PointDTO> getPoints(String username) {
        var points = pointsRepository.getPointsByUsername(username);
        return points.stream().map(PointDTO::fromModel).toList();
    }
}

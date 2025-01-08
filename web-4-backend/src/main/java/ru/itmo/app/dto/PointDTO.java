package ru.itmo.app.dto;

import lombok.Data;
import ru.itmo.app.model.PointModel;
import java.util.Date;

public @Data class PointDTO {
    private double x;
    private double y;
    private double r;
    private boolean result;
    private Date timestamp;

    public static PointDTO fromModel(PointModel pointModel) {
        var pointDTO = new PointDTO();
        pointDTO.setX(pointModel.getX());
        pointDTO.setY(pointModel.getY());
        pointDTO.setR(pointModel.getR());
        pointDTO.setResult(pointModel.isResult());
        pointDTO.setTimestamp(pointModel.getTimestamp());
        return pointDTO;
    }
}

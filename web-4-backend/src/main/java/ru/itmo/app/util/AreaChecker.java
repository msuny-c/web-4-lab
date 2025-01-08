package ru.itmo.app.util;

public class AreaChecker {
    public static boolean inArea(double x, double y, double r) {
        return inCircle(x, y, r) || inRectangle(x, y, r) || inTriangle(x, y, r);
    }

    public static boolean inCircle(double x, double y, double r) {
        return x * x + y * y <= r * r;
    }

    public static boolean inRectangle(double x, double y, double r) {
        return x >= -r && x <= r && y >= -r && y <= r;
    }

    public static boolean inTriangle(double x, double y, double r) {
        return x >= -r && x <= r && y >= -r && y <= r;
    }
}

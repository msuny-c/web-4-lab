package ru.itmo.app.util;

public class AreaChecker {
    public static boolean inArea(double x, double y, double r) {
        return inCircle(x, y, r) || inRectangle(x, y, r) || inTriangle(x, y, r);
    }

    public static boolean inCircle(double x, double y, double r) {
        return x * x + y * y <= (r/2) * (r/2) && x >= 0 && y >= 0;
    }

    public static boolean inRectangle(double x, double y, double r) {
        return x >= -r && x <= 0 && y >= 0 && y <= (r/2);
    }

    public static boolean inTriangle(double x, double y, double r) {
        return y >= (-x - r) && x <= 0 && x >= -r && y <= 0 && y >= -r;
    }
}

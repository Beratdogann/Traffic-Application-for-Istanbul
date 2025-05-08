package com.beratdogan.TrafficBackendApplication;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.zeromq.SocketType;
import org.zeromq.ZMQ;

@Component
public class TrafficPublisher {

    @Autowired
    private TrafficService trafficService;

    private String lat = "41.0082";
    private String lon = "28.9784";

    @PostConstruct
    public void startPublisher() {
        new Thread(() -> {
            ZMQ.Context context = ZMQ.context(1);
            ZMQ.Socket publisher = context.socket(SocketType.PUB);
            publisher.bind("tcp://*:5558");

            while (true) {
                try {
                    String trafficData = trafficService.fetchTrafficData(lat, lon);
                    publisher.send("traffic " + trafficData);
                    Thread.sleep(5000);
                } catch (InterruptedException e) {
                    break;
                }
            }

            publisher.close();
            context.term();
        }).start();
    }

    public void updateCoordinates(String newLat, String newLon) {
        this.lat = newLat;
        this.lon = newLon;
    }
}

package com.beratdogan.TrafficBackendApplication;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.zeromq.SocketType;
import org.zeromq.ZMQ;

@Component
public class TrafficResponder {

    @Autowired
    private TrafficService trafficService;

    @Autowired
    private TrafficPublisher trafficPublisher;

    @PostConstruct
    public void startResponder() {
        new Thread(() -> {
            ZMQ.Context context = ZMQ.context(1);
            ZMQ.Socket responder = context.socket(SocketType.REP);
            responder.bind("tcp://*:5559");

            while (true) {
                byte[] request = responder.recv(0);
                String coords = new String(request);
                String[] parts = coords.split(",");

                if (parts.length == 2) {
                    String lat = parts[0].trim();
                    String lon = parts[1].trim();

                    trafficPublisher.updateCoordinates(lat, lon);

                    String response = trafficService.fetchTrafficData(lat, lon);
                    responder.send(response);
                } else {
                    responder.send("{\"error\":\"Geçersiz koordinat formatı. Beklenen: lat,lon\"}");
                }
            }
        }).start();
    }
}

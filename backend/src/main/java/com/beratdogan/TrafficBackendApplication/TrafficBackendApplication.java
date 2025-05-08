package com.beratdogan.TrafficBackendApplication;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
@ComponentScan(basePackages = "com.beratdogan.TrafficBackendApplication")
@SpringBootApplication
public class TrafficBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(TrafficBackendApplication.class, args);
    }
}

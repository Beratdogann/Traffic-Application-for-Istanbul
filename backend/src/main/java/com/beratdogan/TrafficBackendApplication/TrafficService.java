package com.beratdogan.TrafficBackendApplication;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class TrafficService {

	@Value("${api.key}")
	private String apiKey;


    private final ObjectMapper mapper = new ObjectMapper();

    public String fetchTrafficData(String lat, String lon) {
        try {
            String url = String.format(
                "https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json?point=%s,%s&key=%s",
                lat, lon, apiKey
            );

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).GET().build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            JsonNode json = mapper.readTree(response.body());
            return json.toString();
        } catch (Exception e) {
            return "{\"error\":\"" + e.getMessage() + "\"}";
        }
    }
}

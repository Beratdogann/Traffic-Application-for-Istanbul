package com.beratdogan.TrafficBackendApplication;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode; // ObjectNode'yu import etmelisiniz
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/traffic")
@CrossOrigin(origins = "http://localhost:8081")
public class TrafficController {

    @PostMapping
    public ResponseEntity<JsonNode> getTraffic(@RequestBody Map<String, String> body) {
        String from = body.get("from");
        String to = body.get("to");
        System.out.println("Gelen Veriler - From: " + from + ", To: " + to);
        
        // Koordinat listesi
        Map<String, String> coordinates = new HashMap<>() {{
            put("Adalar", "40.8694,29.1275");
            put("Arnavutköy", "41.1950,28.7404");
            put("Ataşehir", "40.9850,29.1244");
            put("Avcılar", "40.9797,28.7220");
            put("Bağcılar", "41.0390,28.8567");
            put("Bahçelievler", "41.0015,28.8544");
            put("Bakırköy", "40.9759,28.8532");
            put("Başakşehir", "41.0949,28.8025");
            put("Bayrampaşa", "41.0492,28.8992");
            put("Beşiktaş", "41.0438,29.0094");
            put("Beykoz", "41.1257,29.1046");
            put("Beylikdüzü", "41.0015,28.6416");
            put("Beyoğlu", "41.0369,28.9852");
            put("Büyükçekmece", "41.0201,28.5852");
            put("Çatalca", "41.1454,28.4669");
            put("Çekmeköy", "41.0282,29.1989");
            put("Esenler", "41.0449,28.8910");
            put("Esenyurt", "41.0335,28.6829");
            put("Eyüpultan", "41.1092,28.9320");
            put("Fatih", "41.0082,28.9784");
            put("Gaziosmanpaşa", "41.0754,28.9128");
            put("Güngören", "41.0094,28.8724");
            put("Kadıköy", "40.9919,29.0275");
            put("Kağıthane", "41.0777,28.9653");
            put("Kartal", "40.8997,29.1795");
            put("Küçükçekmece", "41.0040,28.7852");
            put("Maltepe", "40.9350,29.1551");
            put("Pendik", "40.8743,29.2519");
            put("Sancaktepe", "40.9910,29.2319");
            put("Sariyer", "41.1690,29.0505");
            put("Silivri", "41.0736,28.2438");
            put("Sultanbeyli", "40.9609,29.2612");
            put("Sultangazi", "41.1064,28.8695");
            put("Şile", "41.1756,29.6136");
            put("Şışli", "41.0605,28.9870");
            put("Tuzla", "40.8188,29.3005");
            put("Ümraniye", "41.0186,29.1112");
            put("Üsküdar", "41.0320,29.0309");
            put("Zeytinburnu", "40.9944,28.9010");
        }};

        // Gelen ilçeden koordinat bilgisi almak
        String latlon = coordinates.getOrDefault(from, "41.0082,28.9784");
        String[] parts = latlon.split(",");
        String lat = parts[0];
        String lon = parts[1];

        System.out.println("Gelen ilçeden koordinatlar: " + lat + ", " + lon);

        try {
            // TomTom API'sine veri çekme
            String apiKey = "sPJ92VFH8pgkBwtnP5zIgb512bXs8Sv9";
            String url = "https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/6/json?point=" + lat + "," + lon + "&key=" + apiKey;
            System.out.println("TomTom API URL: " + url); // URL'yi yazdıralım

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .build();

            // API isteği gönderme
            System.out.println("API isteği gönderiliyor...");
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // API cevabını işleme
            System.out.println("API yanıtı alındı. Durum Kodu: " + response.statusCode());

            ObjectMapper mapper = new ObjectMapper();
            JsonNode json = mapper.readTree(response.body());
            System.out.println("API yanıtı: " + json.toString());

            return ResponseEntity.ok(json);

        } catch (Exception e) {
            System.out.println("Hata oluştu: " + e.getMessage());
            e.printStackTrace();
            
            // ObjectNode kullanarak hata mesajı ekliyoruz
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode error = mapper.createObjectNode();
            error.put("error", "Veri çekilirken hata oluştu.");
            return ResponseEntity.status(500).body(error);
        }
    }
}

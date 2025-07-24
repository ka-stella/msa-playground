package com.sample.memo_service.infrastructure.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config){
         // クライアントが購読するプレフィックス
        config.enableSimpleBroker("/topic");
        // クライアントがメッセージを送信するプレフィックス
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry){
        // WebSocketエンドポイントとCORS設定
        registry.addEndpoint("")
        .setAllowedOriginPatterns("http://localhost:8000", "http://localhost:8080")
        .withSockJS(); 
        // .setAllowedOriginPatterns("*");
    }
}

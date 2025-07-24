package com.sample.memo_service.domain.event;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;

@Getter
public class MemoCreatedEvent{
    private final UUID eventId;
    private final UUID memoId;
    private final String title;
    private final String content;
    private final LocalDateTime occurredAt;

    public MemoCreatedEvent(UUID memoId,String title, String content){
        this.eventId = UUID.randomUUID();
        this.memoId = memoId;
        this.title = title;
        this.content = content;
        this.occurredAt = LocalDateTime.now();
    }
}
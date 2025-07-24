package com.sample.memo_service.domain.event;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;

@Getter
public class MemoUpdatedEvent{
    private final UUID eventId;
    private final UUID memoId;
    private final String oldTitle;
    private final String newTitle;
    private final String oldContent;
    private final String newContent;
    private final LocalDateTime occurredAt;

    public MemoUpdatedEvent(UUID memoId,String oldTitle, String newTitle, String oldContent, String newContent){
        this.eventId = UUID.randomUUID();
        this.memoId = memoId;
        this.oldTitle = oldTitle;
        this.newTitle = newTitle;
        this.oldContent = oldContent;
        this.newContent = newContent;
        this.occurredAt = LocalDateTime.now();
    }
}
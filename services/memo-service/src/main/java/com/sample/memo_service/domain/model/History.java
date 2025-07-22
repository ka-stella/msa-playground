package com.sample.memo_service.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
public class History {
    private final UUID id;
    private final UUID memoId;
    private final String eventType;
    private final String oldTitle;
    private final String newTitle;
    private final String oldContent;
    private final String newContent;
    private final LocalDateTime occurredAt;
}

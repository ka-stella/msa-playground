package com.sample.memo_service.infrastructure.db.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "histories")
@Getter
@Setter
@NoArgsConstructor
public class HistoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private UUID memoId;
    private String eventType;
    private String oldTitle;
    private String newTitle;
    private String oldContent;
    private String newContent;
    private LocalDateTime occurredAt;

    public HistoryEntity(
        UUID memoId,
        String eventType,
        String oldTitle,
        String newTitle,
        String oldContent,
        String newContent,
        LocalDateTime occurredAt
        ){
        this.memoId = memoId;
        this.eventType = eventType;
        this.oldTitle = oldTitle;
        this.newTitle = newTitle;
        this.oldContent = oldContent;
        this.newContent = newContent;
        this.occurredAt = occurredAt;
    }
}

package com.sample.memo_service.presentation.dto.memo;

import com.sample.memo_service.domain.model.Memo;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class MemoResponse {
    private UUID id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MemoResponse(Memo memo){
        this.id = memo.getId();
        this.title = memo.getTitle();
        this.content = memo.getContent();
        this.createdAt = memo.getCreatedAt();
        this.updatedAt = memo.getUpdatedAt();
    }
}

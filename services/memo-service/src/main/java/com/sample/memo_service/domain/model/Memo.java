package com.sample.memo_service.domain.model;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Memo{
    private UUID id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * メモインスタンス生成
     * @param title
     * @param content
     * @return Memo
     */
    public static Memo create(String title, String content){
        return new Memo(UUID.randomUUID(), title, content, LocalDateTime.now(), LocalDateTime.now());
    }

    /**
     * メモインスタンス更新
     * @param newTitle
     * @param newContent
     */
    public void update(String newTitle, String newContent){
        this.title = newTitle;
        this.content = newContent;
        this.updatedAt = LocalDateTime.now();
    }
}

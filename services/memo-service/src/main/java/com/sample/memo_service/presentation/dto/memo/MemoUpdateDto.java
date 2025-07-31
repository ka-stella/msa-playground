package com.sample.memo_service.presentation.dto.memo;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemoUpdateDto {
    private UUID id;
    private String title;
    private String content;

    @JsonCreator
    public MemoUpdateDto(
            @JsonProperty("id") UUID id,
            @JsonProperty("title") String title,
            @JsonProperty("content") String content) {
        this.id = id;
        this.title = title;
        this.content = content;
    }

    @Override
    public String toString() {
        return "MemoUpdateDto{" +
            "id='" + id + '\'' +
            ", title='" + title + '\'' +
            ", content='" + content + '\'' +
            '}';
    }
}
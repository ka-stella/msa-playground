package com.sample.memo_service.presentation.dto.memo;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemoRequest {
    private UUID id;
    private String title;
    private String content;
}

package com.sample.memo_service.presentation.dto.memo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemoRequest {
    private String title;
    private String content;
}

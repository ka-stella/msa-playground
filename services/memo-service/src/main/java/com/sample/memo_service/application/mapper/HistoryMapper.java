package com.sample.memo_service.application.mapper;

import com.sample.memo_service.domain.model.History;
import com.sample.memo_service.infrastructure.db.entity.HistoryEntity;

public class HistoryMapper {
    public static History toDomain(HistoryEntity entity){
        return new History(
            entity.getId(),
            entity.getMemoId(),
            entity.getEventType(),
            entity.getOldTitle(),
            entity.getNewTitle(),
            entity.getOldContent(),
            entity.getNewContent(),
            entity.getOccurredAt()
        );
    }
}

package com.sample.memo_service.infrastructure.kafka;


import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sample.memo_service.domain.repository.MemoRepository;
import com.sample.memo_service.presentation.dto.memo.MemoUpdateDto;

import org.springframework.kafka.annotation.KafkaListener;

@Component
public class KafkaMemoUpdateConsumer {
  private static final Logger logger = LoggerFactory.getLogger(KafkaMemoUpdateConsumer.class);
  private final ObjectMapper objectMapper;
  private final MemoRepository memoRepository;

  public KafkaMemoUpdateConsumer(MemoRepository memoRepository){
    this.memoRepository = memoRepository;
    this.objectMapper = new ObjectMapper();
  }

  @KafkaListener(topics = "memo.update", groupId = "memo-service-group")
  public void listen(String message) {
    logger.info("Kafkaからのメッセージを受信しました。メッセージ{}",message);
    try {
      MemoUpdateDto memoUpdate = objectMapper.readValue(message, MemoUpdateDto.class);
      memoRepository.findById(memoUpdate.getId()).ifPresentOrElse(
        existingMemo -> {
            existingMemo.setTitle(memoUpdate.getTitle());
            existingMemo.setContent(memoUpdate.getContent());
            existingMemo.setUpdatedAt(LocalDateTime.now());
            memoRepository.save(existingMemo);
            logger.info("メモID {} をデータベースに更新しました。", memoUpdate.getId());
        },
        () -> {
            logger.warn("メモID {} の更新メッセージを受信しましたが、該当するメモが見つかりません。", memoUpdate.getId());
        }
      );
    } catch (Exception e) {
    }
  }
}

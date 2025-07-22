package com.sample.memo_service.application;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import com.sample.memo_service.domain.event.MemoCreatedEvent;
import com.sample.memo_service.domain.event.MemoUpdatedEvent;
import com.sample.memo_service.domain.model.Memo;
import com.sample.memo_service.domain.repository.HistoryRepository;
import com.sample.memo_service.domain.repository.MemoRepository;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
public class MemoServiceTest {
    @Mock
    private MemoRepository memoRepository;

    @Mock
    private HistoryRepository historyRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private MemoService memoService;

    private Memo testMemo;
    private UUID testMemoId;

    @BeforeEach
    void setUp() {
        testMemoId = UUID.randomUUID();
        testMemo = new Memo(testMemoId, "test title!", "test content!!", LocalDateTime.now(), LocalDateTime.now());
    }

    @Test
    @DisplayName("メモが正常に作成され、保存されることを検証")
    void createMemo_ShouldReturnSavedMemoAndPublishEvent(){
        //memoRepository.saveが呼び出されたら、testMemoを返す
        when(memoRepository.save(any(Memo.class))).thenReturn(testMemo);
        
        Memo createdMemo = memoService.createMemo("新しいタイトル", "新しいコンテンツ");

        // memoRepository.saveが一度だけ呼び出されたことを検証
        verify(memoRepository, times(1)).save(any(Memo.class));
        // eventPublisher.publishEventが一度だけ呼び出されたことを検証
        verify(eventPublisher, times(1)).publishEvent(any(MemoCreatedEvent.class));

        assertThat(createdMemo).isNotNull();
        assertThat(createdMemo.getId()).isEqualTo(testMemoId);
        assertThat(createdMemo.getTitle()).isEqualTo("test title!");
    }

    @Test
    @DisplayName("メモが正常に更新され、保存されることを検証")
    void updateMemo_ShouldUpdateAndSaveMemo(){
        when(memoRepository.findById(testMemoId)).thenReturn(Optional.of(testMemo));
        when(memoRepository.save(any(Memo.class))).thenReturn(testMemo);

        Optional<Memo> updatedMemo = memoService.updateMemo(testMemoId, "更新タイトル", "更新コンテンツ");

        verify(memoRepository, times(1)).findById(testMemoId);
        verify(memoRepository, times(1)).save(any(Memo.class));
        verify(eventPublisher, times(1)).publishEvent(any(MemoUpdatedEvent.class));

        assertThat(updatedMemo).isPresent();
        assertThat(updatedMemo.get().getTitle()).isEqualTo("更新タイトル");
        assertThat(updatedMemo.get().getContent()).isEqualTo("更新コンテンツ");
    }

    @Test
    @DisplayName("指定されたIDのメモが取得できることを検証")
    void getMemoById_ShouldReturnMemoIfExists() {
        when(memoRepository.findById(testMemoId)).thenReturn(Optional.of(testMemo));

        Optional<Memo> result = memoService.getMemoById(testMemoId);

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(testMemoId);
    }

    @Test
    @DisplayName("指定されたIDのメモが存在しない場合、空のOptionalが返されることを検証")
    void getMemoById_ShouldReturnEmptyIfNotExists() {
        UUID testId = UUID.randomUUID();
        when(memoRepository.findById(testId)).thenReturn(Optional.empty());

        Optional<Memo> result = memoService.getMemoById(testId);

        assertThat(result).isEmpty();
    }
}

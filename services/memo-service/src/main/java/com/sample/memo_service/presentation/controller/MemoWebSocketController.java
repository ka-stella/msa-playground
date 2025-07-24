package com.sample.memo_service.presentation.controller;

import com.sample.memo_service.application.MemoService;
import com.sample.memo_service.domain.model.History;
import com.sample.memo_service.domain.model.Memo;
import com.sample.memo_service.presentation.dto.memo.MemoRequest;
import com.sample.memo_service.presentation.dto.memo.MemoResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class MemoWebSocketController {
    private final MemoService memoService;
    private final SimpMessageSendingOperations messagingTemplate;

    @MessageMapping("/memos.getAll")
    @SendTo("/topic/memos")
    public List<MemoResponse> getAllMemosViaWebSocket() {
        List<Memo> memos = memoService.getAllMemos();
        return memos.stream()
                .map(MemoResponse::new)
                .collect(Collectors.toList());
    }

    // @MessageMapping("/memos.getById")
    // public MemoResponse getMemoByIdViaWebSocket(@Payload UUID id) {  
    //     return memoService.getMemoById(id)
    //             .map(MemoResponse::new)
    //             .orElse(null);
    // }

    // @MessageMapping("/memos.create")
    // @SendTo("/topic/memos")
    // public MemoResponse createMemoViaWebSocket(@Payload MemoRequest request) {
    //     Memo createdMemo = memoService.createMemo(request.getTitle(), request.getContent());
    //     return new MemoResponse(createdMemo);
    // }

    // @MessageMapping("/memos.update")
    // @SendTo("/topic/memos")
    // public MemoResponse updateMemoViaWebSocket(@Payload MemoRequest request) {
    //     UUID id = request.getId();
    //     Memo updatedMemo = memoService.updateMemo(request.getId(), request.getTitle(), request.getContent())
    //             .orElseThrow(() -> new IllegalArgumentException("Memo not found for update: " + id));
    //     return new MemoResponse(updatedMemo);
    // }

    // @MessageMapping("/memos.delete")
    // @SendTo("/topic/memos.deleted")
    // public UUID deleteMemoViaWebSocket(@Payload UUID id) {
    //     memoService.deleteMemo(id);
    //     return id;
    // }

    // @MessageMapping("/memos.getHistories")
    // public List<History> getHistoriesViaWebSocket(@Payload UUID id) {
    //     return memoService.getHistories(id);
    // }
}

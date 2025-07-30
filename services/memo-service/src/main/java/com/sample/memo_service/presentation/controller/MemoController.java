package com.sample.memo_service.presentation.controller;

import com.sample.memo_service.application.MemoService;
import com.sample.memo_service.domain.model.History;
import com.sample.memo_service.domain.model.Memo;
import com.sample.memo_service.presentation.dto.memo.MemoRequest;
import com.sample.memo_service.presentation.dto.memo.MemoResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MemoController {
    private final MemoService memoService;

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Memo Service is healthy!");
    }
    
    @GetMapping("/")
    public ResponseEntity<List<MemoResponse>> getAllMemos(){
        List<Memo> memos = memoService.getAllMemos();
        List<MemoResponse> responses = memos.stream()
                .map(MemoResponse::new)
                .collect(Collectors.toList());
        return new ResponseEntity<>(responses,HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MemoResponse> getMemoById(@PathVariable("id") UUID id){
        return memoService.getMemoById(id)
                .map(memo -> new ResponseEntity<>(new MemoResponse(memo), HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/")
    public ResponseEntity<MemoResponse> createMemo(@RequestBody MemoRequest request){
        Memo createdMemo = memoService.createMemo(request.getTitle(),request.getContent());
        return new ResponseEntity<>(new MemoResponse(createdMemo),HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MemoResponse> updateMemo(@PathVariable("id") UUID id, @RequestBody MemoRequest request){
        return memoService.updateMemo(id, request.getTitle(), request.getContent())
                .map(updatedMemo -> new ResponseEntity<>(new MemoResponse(updatedMemo),HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMemo(@PathVariable("id") UUID id){
        memoService.deleteMemo(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/{id}/histories")
    public ResponseEntity<List<History>> getHistories(@PathVariable("id") UUID id){
        List<History> histories = memoService.getHistories(id);
        if(histories.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(histories);
    }
}

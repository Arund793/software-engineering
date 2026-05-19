package com.compassai.backend.domain;

import com.compassai.backend.domain.dto.AiToolResponse;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/tools")
public class AiToolController {

    private final AiToolRepository repo;

    public AiToolController(AiToolRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public Page<AiToolResponse> list(
            @RequestParam(required=false) String category,
            @RequestParam(required=false) String q,
            @RequestParam(required=false) String origin,
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="20") int size
    ) {
        int pageNumber = Math.max(page, 0);
        int pageSize = Math.min(Math.max(size, 1), 100);
        Page<AiTool> p = repo.findAllFiltered(
                normalize(category),
                normalize(q),
                normalize(origin),
                PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, "updatedAt"))
        );
        return p.map(this::toDto);
    }

    @GetMapping("/{id}")
    public AiToolResponse get(@PathVariable Long id) {
        AiTool t = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "AI tool not found"));
        return toDto(t);
    }

    private String normalize(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private AiToolResponse toDto(AiTool t) {
        return new AiToolResponse(
                t.getId(),
                t.getName(),
                t.getSubTitle(),
                t.getOrigin(),
                t.getUrl(),
                t.getLogo(),
                t.getDescription(),
                t.getCategories().stream().map(Category::getName).sorted().toList()
        );
    }
}

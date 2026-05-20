package com.compassai.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 비밀번호 암호화용 빈
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // HTTP 보안 설정
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CORS 설정을 활성화한다
                .cors(Customizer.withDefaults())
                // 세션 기반 인증을 쓰지만 현재 프론트는 CSRF 토큰을 주고받지 않으므로 개발 단계에서는 비활성화한다.
                .csrf(csrf -> csrf.disable())
                // 요청별 접근 권한을 설정한다
                .authorizeHttpRequests(auth -> auth
                        // 스웨거 문서는 항상 허용한다
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        // 인증 관련 API는 모두 허용한다
                        .requestMatchers("/api/auth/**").permitAll()
                        // 도구 목록/상세 조회는 공개 API로 둔다
                        .requestMatchers(HttpMethod.GET, "/api/tools/**").permitAll()
                        // 그 외 API는 로그인된 사용자만 접근한다
                        .anyRequest().authenticated()
                )
                // 폼 로그인은 사용하지 않는다
                .formLogin(form -> form.disable())
                // HTTP Basic 인증도 사용하지 않는다
                .httpBasic(basic -> basic.disable());

        return http.build();
    }
}

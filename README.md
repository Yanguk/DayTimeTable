# DayTimeTable

## 실행방법

```js
// 설치
npm install

// 시작
npm start

// test
npm run test:e2e
```

## API
```js
HTTP POST /getTimeSlots

RequestBody {
  start_day_identifier: string
  timezone_identifier: string
  service_duration: number
  days?: number
  timeslot_interval?: number
  is_ignore_schedule?: boolean
  is_ignore_workhour?: boolean
}
```

## 어려웠던 점
* timezone 에 따른 해당 날짜 0시의 timestamp를 구하는법에 있어서 고민이 되었습니다.

## 문제 해결
* UTC 타임 기준의 정각 날짜를 date 객체로 만든 후에, 해당 타임존에 맞는 UTC offset 만큼의 차이를 빼주면서 해당 날짜에 해당하는 정각 0시 시간을 구할 수 있었습니다.

## 회고
* 과제가 양이 많은게 아니여서 코드를 더 신중하고 깊게 생각해볼수있는 기회가 되었습니다.
* 과제 기회를 주신 콜라보그라운드에게 감사의 말씀 전합니다.

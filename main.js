const api = {
  key: "fcc8de7015bbb202209bbf0261babf4c",
  base: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);
// Mảng để lưu giữ 5 lần nhiệt độ gần nhất
let cityTemperatures = [];
function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
  }
}
function getResults(query) {
  let attempts = 0;
  const fetchData = () => {
    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => {
        // Kiểm tra trạng thái của response
        if (!weather.ok) {
          throw new Error(`Không thể lấy dữ liệu thời tiết cho địa điểm ${query}`);
        }
        return weather.json();
        
      })
      .then(weatherData => {
       // Kiểm tra xem thành phố có tồn tại trong đối tượng không
        if (!cityTemperatures[weatherData.name]) {
          cityTemperatures[weatherData.name] = [];
        }
        // Thêm nhiệt độ mới vào mảng của thành phố
        cityTemperatures[weatherData.name].unshift(weatherData.main.temp);
        // Giữ chỉ 5 giá trị mới nhất trong mảng của thành phố
        if (cityTemperatures[weatherData.name].length > 5) {
          cityTemperatures[weatherData.name].pop();
        }
        const temperatures = cityTemperatures[weatherData.name];
  let sum = 0; 
  // Sử dụng vòng lặp for để tính tổng của mảng nhiệt độ
  for (let i = 0; i < temperatures.length; i++) {
    sum += temperatures[i];
  }
  // Tính trung bình nhiệt độ từ tổng và độ dài của mảng
  const averageTemperature = sum / temperatures.length;
  
        // Hiển thị kết quả
        displayResults(weatherData, averageTemperature);
        displayCondition(weatherData.main.temp);
      })
      .catch(error => {
        console.error(error);
        // Yêu cầu người dùng nhập lại sau mỗi lần thất bại
        attempts++;
        if (attempts < 3) {
          alert(`Không thể lấy dữ liệu cho địa điểm ${query}. Vui lòng thử lại.`);
          // Gọi fetchData lại nếu người dùng chưa vượt quá số lần cho phép
          fetchData();
        } else {
          alert(`Quá nhiều lần thử. Vui lòng kiểm tra lại địa điểm và thử lại sau.`);
        }
      });
  };
  // Gọi fetchData ở đầu hàm
  fetchData();
}
function displayResults (weather, averageTemperature) {
  console.log('[Search Input]', weather,cityTemperatures[weather.name]);
  let city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;
  let now = new Date();
  let date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now);
  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;
  let TrungBinh = document.querySelector('.TrungBinh');
  TrungBinh.innerText='Nhiệt độ trung bình là : '+averageTemperature;
}

function dateBuilder (d) {
  let months =["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  let days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}
function displayCondition(currentTemperature) {
  let condition = document.querySelector('.condition');
  if (currentTemperature < 20) {
    condition.innerText = "Trời lạnh";
  } else if (currentTemperature > 30) {
    condition.innerText = "Trời ấm";
  } else {
    condition.innerText = "Trời mát";
  }
}
// Cập nhật dữ liệu mỗi phút
setInterval(function () {
  // Gọi hàm getResults với đối số là địa điểm hiện tại (có thể lấy từ trường input hoặc một địa điểm cố định)
  getResults(searchbox.value);
}, 60000); // 60000 milliseconds = 1 phút
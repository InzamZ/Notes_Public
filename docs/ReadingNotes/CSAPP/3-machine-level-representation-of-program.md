# 第 3 章：程序的机器级表示

[[toc]]

机器使用的是机器代码，也就是一系列的 01 字符串，但是我们不直接接触机器代码，我们常使用的高级程序语言让我们方便地编写程序，并且脱离了具体的硬件，可以在不同系统硬件上运行。其实这归功于编译器，它将代码转换成汇编代码，然后在转换成机器代码，链接到机器代码。这看似很方便，但是这不意味着我们不需要学习汇编，因为高级语言隐藏了程序具体的运行方式，这对于我们优化程序效率是没有好处的；其次对于很多的程序漏洞，也是利用了底层的漏洞实现的。后续在探究线程包的运行时也是，在汇编中我们才能体会到如何共享数据，保持数据的私有。

本书使用的是 `x86-64`，这种汇编语言历史悠久，开始于 1978 年第一个 16 位处理器，然后拓展到 32 位，到现在的 64 位。一路以来使用了很多的新特性，以适应新的半导体技术，大部分有 Intel 开发，但是 AMD 也有不少贡献。64 位系统支持 256TB 的内存，而且很容易拓展到 16EB 的容量，这在我们看来是不可思议的，但是我们所处的时代限制了我们的思想，也许以后不需要虚拟内存了，又或者大内存应用程序出现，就像 20 世纪 70 到 80 年代刚普及 32 位的时候，4GB 对当时来说就是无法想象的，而如今却无法忍受只有 4GB 的内存。

::: info ChatGPT 简单介绍一下IA32 编程

IA32 (Intel Architecture 32) 是英特尔公司开发的 32 位 x86 架构的中央处理器 (CPU) 的指令集架构。IA32 编程就是使用这种指令集架构编写程序。

IA32 编程主要涉及以下方面：

1. 汇编语言：IA32 汇编语言是一种底层语言，用于直接控制计算机硬件。程序员需要熟悉 IA32 汇编语言指令集，包括寄存器、内存地址、指令格式等。
2. C 语言：C 语言是高级语言，可以在 IA32 架构上进行编译和运行。程序员需要熟悉 C 语言在 IA32 架构下的特性，如指针、位运算、内存分配等。
3. 操作系统：IA32 编程还涉及操作系统的开发。操作系统是在 IA32 架构上运行的软件，负责管理计算机硬件资源和提供服务。程序员需要了解 IA32 架构下操作系统的特性，如中断处理、内存管理、进程调度等。
4. 应用程序开发：IA32 编程还包括应用程序的开发。应用程序是在操作系统上运行的软件，提供各种功能和服务。程序员需要了解 IA32 架构下的应用程序开发，如图形用户界面、网络通信、数据库访问等。

IA32 编程需要程序员具备扎实的计算机系统基础知识和编程技能，了解 IA32 架构的特性和应用，才能开发高效、稳定的程序。

:::

## 3.1 历史观点

Intel 的处理器模型不断发展，我们用实现处理器需要的晶体管数量表示其演变过程的复杂性，其中 K 不是二进制下的 K，单指 1000。下面列举：

1. 8086 处理器 (1978，29K 个晶体管)：第一代单芯片、16 位微处理器之一，8088 是一个变种，添加了一个外部 8 位总线，这是早期 IBM 个人电脑的心脏，与当时微软联合开发了 MS-DOS 系统。最开始只有 32768 个字节的内存和两个软驱，虽然只有 16 位，但是却有 20 位地址线，因此可以寻址 1MB 的内存。之后推出 8087 浮点协处理器，与一个 8086 或者 8088 一起配合使用，8087 开启了 x86 的浮点模型，一般称为 x87 模型。

   ::: tip ChatGPT 为什么 16 位处理器却可以使用 20 位的地址？

   8086 处理器是一种 16 位处理器，但它可以生成 20 位物理地址。这是通过分段技术实现的。

   分段是 x86 架构中使用的一种技术，它将内存空间划分为较小的段。每个段由一个段选择器标识，段选择器是存储在段寄存器中的 16 位值。段选择器指向段的基地址，偏移量加上基地址就可以生成物理地址。

   8086 处理器使用 16 位的段选择器，可以寻址 64KB 的内存。但是，该处理器有 20 个地址线，这意味着它可以寻址多达 1MB 的内存。为了寻址更大的内存空间，处理器使用了一种称为内存分段的机制。段选择器用于选择最多 64K 个段之一，偏移量用于访问该段中的特定字节。

   通过使用内存分段，8086 处理器能够生成 20 位物理地址，即使它是一种 16 位处理器。这使它可以访问比其它 16 位处理器更多的内存空间。

   :::

2. 80286 (1982，134K 个晶体管)：增加更多寻址形式，现在已经废弃。构成了 IBM PC-AT 个人计算机的基础，这种计算机是 MS Windows 最初的使用平台。

3. i386 (1985，275K 个晶体管)：将体系结构扩展到 32 位，支持平坦寻址模式。这也是第一台支持 Unix 操作系统的机器。

   ::: tip ChatGPT 平坦寻址模式是什么？

   平坦寻址模式 (Flat Addressing Mode) 是一种内存寻址方式，它将整个内存空间看作一个连续的、无缝的地址空间。在平坦寻址模式下，所有的内存地址都是唯一的，并且是连续的整数值。这种寻址方式可以简化内存管理，减少开发人员需要处理的内存管理任务。

   相比之下，在分段寻址模式下，内存空间被分成许多不同的段，每个段可以有自己的起始地址和大小。在分段寻址模式下，一个逻辑地址 (由段选择器和偏移量组成) 需要转换为物理地址，这需要使用特定的地址转换机制。这种转换会增加计算机的复杂性，增加内存访问的延迟。

   在平坦寻址模式下，CPU 可以直接使用 32 位或 64 位的地址来访问整个内存空间。这种寻址模式最初出现在 80386 处理器中，它的引入极大地简化了操作系统和应用程序的开发，同时也加快了内存访问速度。

   总之，平坦寻址模式是一种简单、快速的内存寻址方式，它将整个内存空间视为一个连续的地址空间，避免了繁琐的地址转换和内存管理任务，提高了系统的效率和可靠性。

   :::

4. i486 (1989，1.2M 晶体管)：改善性能，把浮点单元集成到处理器芯片上，但是指令集没有显著变化。

5. Pentium (1993，3.1M 晶体管)：改善性能，对指令集进行小的扩展。

6. PentiumPro (1995，5.5M 晶体管)：引进全新的处理器设计，内部称为 P6 微体系架构。指令集中添加一类 “条件传送” 指令。

7. Pentium/MMX (1997，4.5M 晶体管)：在 Pentium 处理器中增添了处理整数向量的指令，每个数据可以是 1、2 或 4 字节，每个向量总长 64 位。

8. Pentium II (1997，7M 晶体管)：P6 微体系架构的延伸。

9. Pentium III (1999，8.2M 晶体管)：引入 SSE，支持处理整数和浮点向量的指令，每个数据可以是 1、2 或 4 字节，包装为 128 位向量，使用二级高速缓存，因此该芯片后续最多支持 24M 的晶体管。

10. Pentium 4 (2000，42M 晶体管)：支持 SSE2，支持新的数据类型，包括双精度浮点数，还有针对新类型的 144 条新指令。至此，编译器可以使用 SSE，舍弃 x87，用于编译浮点代码。

11. Pentium 4E (2004，125 个晶体管)：增加了超线程，允许一个处理器上同时运行两个程序。还增加了 EM64T，这是 Intel 针对 AMD 提出的对 IA32 的 64 位扩展的实现，x86-64

12. Core 2 (2006，291M 晶体管)：回归到类似 P6 的微体系架构，是 Intel 第一个多核微处理器，多个处理器在一个芯片上，但不支持超线程。

13. Core i7，Nehalem (2008，781M 晶体管)：支持超线程，多核处理器，最初支持每个核上同时运行两个程序，每个芯片最多四个核。

14. Core i7，Sandy Bridge (2011，1.17G 晶体管)：引入了 AVX，这是对 SSE 的扩展，允许把数据封装入 256 位向量。

15. Core i7，Haswell (2013，1.4G 晶体管)：引入了 AVX2，对 AVX 的改进，支持了更多的指令和指令格式。

::: info ChatGPT 介绍一下摩尔定律

摩尔定律 (Moore's Law) 是指，在集成电路技术领域，每 18-24 个月，集成电路上可容纳的晶体管数量将会翻倍，同时芯片大小将会缩小一半，性能将会提高，成本将会下降。这个定律得名于英特尔公司联合创始人戈登·摩尔 (Gordon Moore)，他在1965年提出了这个定律。

摩尔定律是现代计算机技术发展中最重要的规律之一，它促进了计算机技术的快速发展，推动了计算机的普及和应用。这个定律使得计算机的性能不断提高，同时价格不断降低，为人们提供了更加强大和实用的计算机产品和服务。

摩尔定律的成立和持续发展得益于半导体技术的不断进步和创新。随着半导体工艺的不断提高，芯片上可容纳的晶体管数量越来越多，同时芯片的大小越来越小，功耗越来越低。这些进步使得计算机在性能、功耗、体积等方面都取得了长足的进步，成为现代社会不可或缺的重要工具。

然而，随着技术的不断进步，摩尔定律也面临着挑战。由于技术的逐渐成熟，芯片制造过程越来越复杂和昂贵，摩尔定律的速度已经开始放缓。一些专家认为，随着摩尔定律的逐渐失效，计算机技术的发展将进入一个新的时代，需要寻求新的技术突破和创新，以继续推动计算机技术的发展。

:::

`Intel` 的芯片指令架构逐渐成为了标准，因此上述表述不针对其芯片，对于其他厂商生产的与之兼容的处理器也适用。还有 `x86` 早期的部分复杂指令，现在也很多不关注了，例如 `x87` 被 `SSE` 取代和早期寻址方式。

## 3.2 程序编码

```bash
gcc -Og -o p p1.c p2.c
```

看一下上面的命令，其中 `-Og` 指定了优化等级，`-o p` 指定了输出文件，后面的为编译的文件。一般来说优化等级越高，运行速度越快，但是底层逻辑改变的越多，想要保留原始代码和底层代码的联系选用低级的编译等级。

编译器在第一章讲过，经历了预处理，编译，汇编，链接。预处理把头文件和 `#define` 处理替换，编译阶段把高级代码转换成汇编，汇编阶段转换成机器代码，此时产生了两个文件，内部代码没有全局地址；最后阶段输出链接在一起，包括 `printf` 等函数，得到处理器运行的代码。

::: info ChatGPT C语言的编译优化选项

C 语言编译器提供了一些编译优化选项，可以让编译器在编译源代码时进行一些针对性的优化，以提高程序的执行效率和优化代码的大小。以下是一些常用的 C 语言编译优化选项：

1. -O：这是最基本的编译优化选项，表示开启所有的优化选项。可以根据需求使用-O1、-O2、-O3 等级别的优化选项，级别越高，编译器进行的优化越多，但同时编译时间也会增加。
2. -Os：这个选项可以让编译器尽可能地优化代码的大小，而不是优化代码的执行速度。
3. -Og：这个选项可以让编译器进行一些基本的优化，但同时保留代码的易读性和调试信息，可以方便调试程序。
4. -finline-functions：这个选项可以让编译器尝试将函数调用内联展开，从而避免函数调用的开销，提高程序的执行效率。
5. -fprofile-generate/-fprofile-use：这两个选项可以配合使用，-fprofile-generate 可以让编译器生成程序运行时的性能统计信息，-fprofile-use 则可以使用这些信息进行优化，从而提高程序的执行效率。
6. -funroll-loops：这个选项可以让编译器尝试将循环展开，从而减少循环的迭代次数，提高程序的执行效率。

总之，C 语言编译器提供了多种编译优化选项，可以根据不同的需求和情况选择合适的优化选项，从而提高程序的执行效率和优化代码的大小。但同时需要注意，过多的优化选项可能会导致编译时间增加，代码的可读性降低等问题，需要权衡利弊，选择合适的优化选项。

:::

### 3.2.1 机器级代码

计算机系统采用简单的抽象隐藏底层的实现细节，在机器级编程中，最重要的两个抽象是指令架构和虚拟地址。指令集架构 (ISA) 的抽象规定了指令格式，处理器状态，以及指令对状态的影响。大多的 ISA 都是规定指令顺序运行，但是处理器的硬件设计远比描述的精细复杂，可以同时运行多条指令，但是可以采取措施使其按照 ISA 预期的顺序运行。虚拟地址是指提供的模型是一个巨大的字节数组，实际实现是多个硬件存储器和操作系统配合实现。

实际过程中，编译器会完成大部分工作，将 C 语言提供的抽象执行模型转换为处理器能够执行的基本指令，汇编代码已经非常接近机器代码，但是由于使用文本让程序员能更好理解里面的逻辑。

x86-64 机器代码与 C 语言代码差别较大，对程序员不可见的处理器状态也是可见的：

- 程序计数器 (x86-64 中用 %rip 表示，一般称为 PC 寄存器)：给出下一条指令在内存的地址
- 整数寄存器文件共 16 个，用于储存地址或者中间变量
- 条件码寄存器：存储算数指令或逻辑指令的状态信息，用于条件控制
- 一组向量寄存器：用于储存一个或者多个整数或浮点数值

对于机器代码来说，内存就是一个大字节数组，所有数据都是单纯的 01。程序内存包括：可执行机器代码，操作系统需要的信息，管理调用的运行时栈，用户分配的内存块。x86-64 目前要求使用 64 位地址，且前 16 位值为零，这是虚拟内存，一般只有少部分虚拟内存在物理内存，有操作系统管理。

